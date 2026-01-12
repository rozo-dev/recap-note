import axios from "axios";

const api_base = process.env.REACT_APP_API_URL;

export default function getRandomImage(query) {
  const url = `${api_base}/randomImage/${query}`;

  return axios
    .get(url, {
      withCredentials: true,
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
      return response.data;
    })
    .then((data) => {
      const imageUrl = data;
      return imageUrl;
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error;
    });
}
