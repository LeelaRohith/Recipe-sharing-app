import FormDialog from "./Addrecipe";

import RecipeReviewCard from "./Recipecard";
import PrimarySearchAppBar from "./Toolbar";

import axios from "axios";
import { useState, useEffect, useCallback } from "react";

export default function Myrecipes() {
  const [recipedetails, setRecipedetails] = useState([]);

  const [currentuserid, setCurrentuserid] = useState("");
  const [userfirstname, setUserfirstname] = useState("");
  const [userlastname, setUserlastname] = useState("");
  const [imageData, setImageData] = useState({});

  const fetchData = useCallback(async () => {
    const headers = {
      Authorization: "Bearer " + localStorage.getItem("token"),
    };
    const res = await axios.get("http://localhost:8080/api/v1/user", {
      headers,
    });

    //console.log(response.data);

    setCurrentuserid(res.data.id);
    setUserfirstname(res.data.firstname);
    setUserlastname(res.data.lastname);

    const recipeResponse = await axios.get(
      "http://localhost:8080/api/v1/user/currentuserrecipes/" + res.data.id,
      {
        headers,
      }
    );

    setRecipedetails(recipeResponse.data);
    recipeResponse.data.map(async (item, index) => {
      const image = item.image;

      const response = await axios.get(
        "http://localhost:8080/api/v1/user/download/" + image,
        {
          responseType: "arraybuffer",
          headers: { ...headers },
        } // Specify the response type as arraybuffer
      );
      const data = new Blob([response.data]);
      const imageUrl = URL.createObjectURL(data);

      // console.log(image);
      setImageData((prev) => ({ ...prev, [image]: imageUrl }));
    });
    //console.log(recipeResponse.data);
  }, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <PrimarySearchAppBar></PrimarySearchAppBar>
      <br></br>
      <div style={{ textAlign: "center" }}>
        <FormDialog
          recipedetails={recipedetails}
          setRecipedetails={setRecipedetails}
          setImageData={setImageData}
        ></FormDialog>
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
        {imageData &&
          recipedetails &&
          recipedetails.map((item, index) => {
            return (
              <div key={index}>
                <RecipeReviewCard
                  recipedetails={recipedetails}
                  setRecipedetails={setRecipedetails}
                  details={item}
                  userfirstname={userfirstname}
                  userlastname={userlastname}
                  image={imageData[item.image]}
                  type="edit"
                  userid={currentuserid}
                ></RecipeReviewCard>
              </div>
            );
          })}
      </div>
    </div>
  );
}
