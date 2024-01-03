import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Menu from "@mui/material/Menu";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import MuiAlert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useState, useEffect } from "react";
import axios from "axios";

import CloseIcon from "@mui/icons-material/Close";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
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

export default function RecipeReviewCard(props) {
  // const [open, setOpen] = React.useState(false);
  // const [imageData, setImageData] = useState(null);

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };
  // const handleClose = () => {
  //   setOpen(false);
  // };
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {props.userfirstname.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={props.details.name}
        subheader={props.userfirstname + " " + props.userlastname}
      />
      <CardMedia
        component="img"
        height="194"
        image={props.image}
        alt="Paella dish"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {props.details.description}
        </Typography>
        <br></br>
        {props.type === "view" ? (
          <Viewrecipe
            details={props.details}
            userfirstname={props.userfirstname}
            userlastname={props.userlastname}
          ></Viewrecipe>
        ) : (
          <Editform
            details={props.details}
            userfirstname={props.userfirstname}
            userlastname={props.userlastname}
            image={props.image}
          ></Editform>
        )}
      </CardContent>
    </Card>
  );
}
function Editform(props) {
  const [open, setOpen] = React.useState(false);
  const [imageData, setImageData] = useState(null);
  const [ingredients, setIngredients] = React.useState(
    props.details.ingredients
  );
  const [newingredient, setNewingredient] = React.useState("");
  const [imagename, setImagename] = React.useState("");
  const [uploadedImage, setUploadedImage] = React.useState(null);
  const [file, setFile] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
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
  const handleDelete = (ingredient) => {
    setIngredients(ingredients.filter((x) => x !== ingredient));
    //console.log(ingredient);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userEnteredRecipe = {
      name: data.get("name"),
      date: props.details.date,
      description: data.get("description"),
      cookingInstructions: data.get("cookinginstructions"),
      image: props.image,
    };
    // console.log(userEnteredRecipe);
    // console.log(ingredients);
  };
  const handleDeleterecipe = async (event) => {};

  return (
    <React.Fragment>
      <Button
        style={{ marginRight: "15px" }}
        variant="contained"
        onClick={handleClickOpen}
      >
        Edit
      </Button>

      <Button variant="contained" onClick={handleDeleterecipe}>
        Delete
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Edit Recipe</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              defaultValue={props.details.name}
              margin="normal"
              required
              fullWidth
              type="text"
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              autoFocus
            />
            <TextField
              defaultValue={props.details.description}
              margin="normal"
              required
              fullWidth
              type="text"
              id="description"
              label="Describe the recipe"
              name="description"
              autoComplete="description"
              autoFocus
            />
            <Stack direction="column" spacing={1}>
              {ingredients.map((ingredient, index) => (
                <Chip
                  label={ingredient.ingredient}
                  onDelete={() => handleDelete(ingredient)}
                  key={index}
                />
              ))}
            </Stack>

            <TextField
              margin="normal"
              required={props.details.ingredients.length === 0}
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
              defaultValue={props.details.cookingInstructions}
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

            {uploadedImage === null ? (
              <img
                src={props.image}
                alt="Uploaded"
                style={{ maxWidth: "100%", maxHeight: "300px" }}
              />
            ) : (
              <img
                src={uploadedImage}
                alt="Uploaded"
                style={{ maxWidth: "100%", maxHeight: "300px" }}
              />
            )}
            <p style={{ textAlign: "center" }}>
              {imagename.length === 0 ? props.details.name : imagename}
            </p>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              SUBMIT RECIPE
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

function Viewrecipe(props) {
  const [open, setOpen] = React.useState(false);
  // const [imageData, setImageData] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Button variant="contained" onClick={handleClickOpen}>
        View Recipe
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {props.details.name}
          <br></br>
          <sub>
            Uploaded by {props.userfirstname} {props.userlastname} on{" "}
            {props.details.date}
          </sub>
        </DialogTitle>

        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <h3>Description</h3>
          <br></br>
          <Typography gutterBottom>{props.details.description}</Typography>
          <br></br>
          <h3>Ingredients</h3>
          <br></br>

          <ul>
            {props.details.ingredients &&
              props.details.ingredients.map((item, index) => {
                return (
                  <li key={index}>
                    <Typography>{item.ingredient}</Typography>
                  </li>
                );
              })}
          </ul>

          <br></br>
          <h3>Cooking Instructions</h3>
          <br></br>
          <Typography gutterBottom>
            {props.details.cookingInstructions}
          </Typography>
        </DialogContent>
        {/* <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Save changes
          </Button>
        </DialogActions> */}
      </BootstrapDialog>
    </div>
  );
}
