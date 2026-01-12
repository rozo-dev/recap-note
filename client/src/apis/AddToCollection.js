const api_base = process.env.REACT_APP_API_URL;

const jwtToken = JSON.parse(localStorage.getItem("jwtToken"));

const AddNoteToCollection = async (collectionId, noteId, userId) => {
  try {
    if (jwtToken) {
      const headers = {
        Authorization: `Bearer ${jwtToken}`,
        "content-type": "application/json",
      };

      const response = await fetch(
        api_base + `/collection/addnotes/${collectionId}/${userId}`,
        {
          method: "PATCH",
          headers,
          credentials: "include",
          body: JSON.stringify({
            noteId: noteId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network Error failed to fetch.");
      }

      const data = await response.json();
      return data.message; // Return the message from the fetch response.
    }
  } catch (error) {
    console.error("Error" + error.message);
    return null;
  }
};

export default AddNoteToCollection;
