const api_base = process.env.REACT_APP_API_URL;

const jwtToken = JSON.parse(localStorage.getItem("jwtToken"));

const deleteFromCollection = async (collectionId, noteId, userId) => {
  try {
    if (jwtToken) {
      const headers = {
        Authorization: `Bearer ${jwtToken}`,
        "content-type": "application/json",
      };

      await fetch(
        api_base + `/collection/deletenote/${collectionId}/${userId}`,
        {
          method: "PATCH",
          headers,
          credentials: "include",
          body: JSON.stringify({
            noteId: noteId,
          }),
        }
      );
    }
  } catch (error) {
    console.error(error);
  }
};

export default deleteFromCollection;
