import getRandomImage from "../apis/getRandomImage";

const jwtToken = JSON.parse(localStorage.getItem("jwtToken"));

const api_base = process.env.REACT_APP_API_URL;

export default async function addCollection(
  userInfo,
  setCollections,
  collectionName,
  setStatusMessage,
  randomImageUrl
) {
  if (!userInfo) {
    return;
  }
  await getRandomImage(collectionName).then(async (result) => {
    if (jwtToken) {
      const headers = {
        Authorization: `Bearer ${jwtToken}`,
        "content-type": "application/json",
      };

      try {
        const response = await fetch(api_base + "/createCollection", {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify({
            name: collectionName,
            userID: userInfo._id,
            imageUrl: result,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setCollections((prevCollections) => [
            ...prevCollections,
            data.collection,
          ]);
          const returnedMessage = data.message;
          setStatusMessage(returnedMessage);
          return returnedMessage;
        }
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  });
}
