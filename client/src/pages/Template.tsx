import { useParams } from "react-router-dom";

function Template() {
  const { id } = useParams(); // Extract 'id' from the URL

  // fetch json from the ipfs url

  return (
    <div>
      <h1>Template Page</h1>
      <p>Template ID: {id}</p>
    </div>
  );
}

export default Template;
