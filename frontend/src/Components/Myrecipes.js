import FormDialog from "./Addrecipe";
import SimpleDialogDemo from "./Addrecipe";
import RecipeReviewCard from "./Recipecard";
import PrimarySearchAppBar from "./Toolbar";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Myrecipes() {
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
  const fetchData = async () => {
    const res = await axios.get("http://localhost:8080/api/v1/user", {
      headers,
    });

    //console.log(response.data);
    setCurrentuseremail(res.data.email);
    setCurrentuserid(res.data.id);
    setUserfirstname(res.data.firstname);
    setUserlastname(res.data.lastname);

    const recipeResponse = await axios.get(
      "http://localhost:8080/api/v1/user/currentuserrecipes/" + res.data.id,
      {
        headers,
      }
    );
    //   console.log(recipeResponse.data);
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
    //console.log(recipeResponse.data);
  };

  useEffect(() => {
    fetchData();
    // const fetchImage = async () => {
    //   try {
    //     const response = await axios.get(
    //       "http://localhost:8080/api/v1/user/download/1704112745749-1668517537383.jpg",
    //       {
    //         responseType: "arraybuffer",
    //         headers: { ...headers },
    //       } // Specify the response type as arraybuffer
    //     );
    //     const data = new Blob([response.data]);
    //     const imageUrl = URL.createObjectURL(data);
    //     setImageUrl(imageUrl);
    //   } catch (error) {
    //     console.error("Error fetching image:", error);
    //   }
    // };
    // fetchImage();
    // return () => {
    //   URL.revokeObjectURL(imageData);
    // };
  }, [recipedetails]);

  return (
    <div>
      <PrimarySearchAppBar></PrimarySearchAppBar>
      <br></br>
      <div style={{ textAlign: "center" }}>
        <FormDialog></FormDialog>
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
        {/* <img src={imageUrl} alt="hello"></img> */}
        {imageData &&
          recipedetails &&
          recipedetails.map((item, index) => {
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
