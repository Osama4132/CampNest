import axios from "axios"

export default function Newcampground() {
  const fetchData = async () => {
    const response = await axios.get("/api/campgrounds");
    console.log(response.data);
  };
  return (
    <>
      <h1>Camprounds page</h1>
      <button onClick={fetchData}>Fetch Data</button>
    </>
  );
}
