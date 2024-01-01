import PrimarySearchAppBar from "./Toolbar";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import RecipeReviewCard from "./Recipecard";
import { useState, useEffect } from "react";
import axios from "axios";
export default function Homepage() {
  const [recipedetails, setRecipedetails] = useState([]);
  const [currentuseremail, setCurrentuseremail] = useState("");
  const [currentuserid, setCurrentuserid] = useState("");
  const [userfirstname, setUserfirstname] = useState("");
  const [userlastname, setUserlastname] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [imageData, setImageData] = useState({});
  const headers = {
    Authorization: "Bearer " + localStorage.getItem("token"),
  };
  //const allRecipes = ["a", "a", "a", "a", "a", "a", "a"];
  const fetchData = async () => {
    const res = await axios.get("http://localhost:8080/api/v1/user", {
      headers,
    });

    //console.log(response.data);
    setCurrentuseremail(res.data.email);
    setCurrentuserid(res.data.id);
    setUserfirstname(res.data.firstname);

    const recipeResponse = await axios.get(
      "http://localhost:8080/api/v1/user/allrecipes",
      {
        headers,
      }
    );

    setRecipedetails(recipeResponse.data);
    recipeResponse.data.map(async (item, index) => {
      const image = item.image;
      if (image) {
        const response = await axios.get(
          "http://localhost:8080/api/v1/user/download/" + image,
          {
            responseType: "arraybuffer",
            headers: { ...headers },
          } // Specify the response type as arraybuffer
        );
        const data = new Blob([response.data]);
        const imageUrl = URL.createObjectURL(data);
        setImageUrl(imageUrl);
        // console.log(image);
        setImageData((prev) => ({ ...prev, [image]: imageUrl }));
      }
    });
  };
  useEffect(() => {
    fetchData();
  }, [recipedetails]);
  return (
    <div>
      <PrimarySearchAppBar></PrimarySearchAppBar>
      <br></br>
      <div style={{ textAlign: "center" }}>
        <TextField
          id="input-with-icon-textfield"
          label="Search Recipes"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
      </div>
      <br></br>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {recipedetails.map((item, index) => {
          return (
            <div key={index}>
              <RecipeReviewCard
                details={item}
                userfirstname={userfirstname}
                userlastname={userlastname}
                image={imageData[item.image]}
              ></RecipeReviewCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}
