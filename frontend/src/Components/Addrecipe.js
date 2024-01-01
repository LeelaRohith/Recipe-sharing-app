import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function FormDialog() {
  const [imagename, setImagename] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const [uploadedImage, setUploadedImage] = React.useState("");
  const [currentuseremail, setCurrentuseremail] = useState("");
  const [currentuserid, setCurrentuserid] = useState("");
  const [file, setFile] = useState(null);
  const headers = {
    Authorization: "Bearer " + localStorage.getItem("token"),
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const { enqueueSnackbar } = useSnackbar();
  const handleClose = () => {
    setOpen(false);
  };
  var today = new Date();

  // Get the day of the month
  var dd = today.getDate();

  // Get the month (adding 1 because months are zero-based)
  var mm = today.getMonth() + 1;

  // Get the year
  var yyyy = today.getFullYear().toString();

  // Add leading zero if the day is less than 10
  if (dd < 10) {
    dd = "0" + dd;
  }

  // Add leading zero if the month is less than 10
  if (mm < 10) {
    mm = "0" + mm;
  }
  var todaydate = dd + "-" + mm + "-" + yyyy;

  // Format the date as mm-dd-yyyy and log it

  const [ingredients, setIngredients] = React.useState([]);
  const [newingredient, setNewingredient] = React.useState("");
  //console.log(newingredient);
  const handleDelete = (ingredient) => {
    setIngredients(ingredients.filter((x) => x !== ingredient));
    console.log(ingredient);
  };

  //const [file, setFile] = React.useState();
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    // Do something with the selected file, such as upload or display it
    console.log("Selected File:", selectedFile);
    setFile(selectedFile);

    displayImage(selectedFile);
    // axios
    //   .post("http://localhost:8080/api/v1/user/upload", selectedFile, {
    //     headers,
    //   })
    //   .then(function (response) {
    //     console.log(response);
    //     // enqueueSnackbar(response.data.text, {
    //     //   variant: "success",
    //     //   autoHideDuration: 5000,
    //     // });
    //   })
    // .catch(function (error) {});
  };
  const displayImage = (file) => {
    const reader = new FileReader();
    setImagename(file.name);

    reader.onload = (e) => {
      const imageDataURL = e.target.result.toString();
      // Update state or directly display the image as needed
      console.log("Image Data URL:", imageDataURL);
      setUploadedImage(imageDataURL);
    };

    reader.readAsDataURL(file);
  };

  const fetchData = async () => {
    const res = await axios.get("http://localhost:8080/api/v1/user", {
      headers,
    });

    //console.log(response.data);

    setCurrentuseremail(res.data.email);
    setCurrentuserid(res.data.id);
  };
  useEffect(() => {
    fetchData();
  }, [currentuseremail]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const uploadImageData = new FormData();
    uploadImageData.append("file", file, file.name);

    const imageuploadResponse = await axios.post(
      "http://localhost:8080/api/v1/user/upload",
      uploadImageData,
      { headers }
    );

    const userEnteredRecipe = {
      name: data.get("name"),
      date: todaydate,
      description: data.get("description"),
      ingredients: ingredients,
      cookingInstructions: data.get("cookinginstructions"),
      image: imageuploadResponse.data,
    };

    const response = await axios.post(
      "http://localhost:8080/api/v1/user/addrecipe/" + currentuserid,
      userEnteredRecipe,
      { headers }
    );
    enqueueSnackbar(response.data.text, {
      variant: "success",
      autoHideDuration: 5000,
    });
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add New Recipe
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>New Recipe</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              type="text"
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              autoFocus
              // onChange={(e) => {
              //   setRecipe({ ...recipe, name: e.target.value });
              // }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              type="text"
              id="description"
              label="Describe the recipe"
              name="description"
              autoComplete="description"
              autoFocus
              // onChange={(e) => {
              //   setRecipe({ ...recipe, description: e.target.value });
              // }}
            />
            <Stack direction="column" spacing={1}>
              {ingredients.map((ingredient, index) => (
                <Chip
                  label={ingredient}
                  onDelete={() => handleDelete(ingredient)}
                  key={index}
                />
              ))}
            </Stack>

            <TextField
              margin="normal"
              required={ingredients.length === 0}
              fullWidth
              type="text"
              id="ingredient"
              label="Add the list of ingredients"
              name="ingredient"
              autoComplete="ingredient"
              autoFocus
              onChange={(e) => {
                setNewingredient(e.target.value);
              }}
            />
            <div style={{ textAlign: "center" }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setIngredients((current) => [...current, newingredient]);
                }}
              >
                Add
              </Button>
            </div>
            <TextField
              margin="normal"
              required
              fullWidth
              multiline
              rows={10}
              type="text"
              id="cookinginstructions"
              label="Cooking Instructions"
              name="cookinginstructions"
              autoComplete="cookinginstructions"
              autoFocus
              // onChange={(e) => {
              //   setRecipe({ ...recipe, description: e.target.value });
              // }}
            />
            <div style={{ textAlign: "center" }}>
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
              >
                Upload Image
                <VisuallyHiddenInput type="file" onChange={handleFileChange} />
              </Button>
            </div>
            <br></br>
            {uploadedImage == null ? null : (
              <img
                src={uploadedImage}
                alt="Uploaded"
                style={{ maxWidth: "100%", maxHeight: "300px" }}
              />
            )}
            <p style={{ textAlign: "center" }}>{imagename}</p>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              SUBMIT RECIPE
            </Button>
          </Box>
          {/* <DialogContentText>Name</DialogContentText>
          <br></br>

          
        

          
          <DialogContentText>Ingredients</DialogContentText>
          {ingredients.length === 0 ? null : <br></br>}
          
          <br></br>
          <TextField
            required={ingredients.length === 0}
            style={{ marginBottom: "15px" }}
            fullWidth
            label="Add ingredient"
            id="fullWidth"
            onChange={(e) => {
              setNewingredient(e.target.value);
            }}
          />
          <div style={{ textAlign: "center" }}>
            <Button
              variant="outlined"
              onClick={() => {
                setIngredients((current) => [...current, newingredient]);
              }}
            >
              Add
            </Button>
          </div> */}

          {/* <br></br>
          <DialogContentText>Cooking Instructions</DialogContentText>
          <br></br>
          <TextField
            id="outlined-multiline-static"
            label="Add Cooking Instructions"
            multiline
            rows={10}
            defaultValue=""
            required
            onChange={(e) => {
              setRecipe({ ...recipe, cookingInstructions: e.target.value });
            }}
          />
          <br></br>
          <br></br>
          <div style={{ textAlign: "center" }}>
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
            >
              Upload Image
              <VisuallyHiddenInput type="file" onChange={handleFileChange} />
            </Button>
          </div>
          <br></br>
          {uploadedImage == null ? null : (
            <img
              src={uploadedImage}
              alt="Uploaded"
              style={{ maxWidth: "100%", maxHeight: "300px" }}
            />
          )}
          <p style={{ textAlign: "center" }}>{imagename}</p>
          <br></br>

          <div style={{ textAlign: "center" }}>
            <Button
              variant="contained"
              style={{ marginBottom: "8px" }}
              onClick={validateform}
            >
              Submit
            </Button>
          </div> */}
        </DialogContent>
      </Dialog>
      {/* <Snackbar
        open={snackbar}
        autoHideDuration={4000}
        onClose={() => {
          setSnackbar(false);
        }}
      >
        <Alert
          onClose={() => {
            setSnackbar(false);
          }}
          severity="error"
          sx={{ width: "100%" }}
          autohideduration={4000}
        >
          Please fill all the fields and upload image to submit your recipe
        </Alert>
      </Snackbar> */}
    </React.Fragment>
  );
}
