const api_base = process.env.REACT_APP_API_URL;

const jwtToken = JSON.parse(localStorage.getItem("jwtToken"));

export default async function addNote(
  userInfo,
  setNotes,
  note,
  setNotesUpdated
) {
  if (!userInfo) {
    return;
  }
  try {
    if (jwtToken) {
      const headers = {
        Authorization: `Bearer ${jwtToken}`,
        "content-type": "application/json",
      };

      const response = await fetch(api_base + "/addnotes", {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({
          title: note.title,
          content: note.content,
          userID: userInfo._id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setNotes((prevNotes) => [...prevNotes, data.note]);
        const returnedMessage = data.message;
        return returnedMessage;
      }
    }
  } catch (error) {
    setNotesUpdated(false);
    console.error(error);
  }
}
