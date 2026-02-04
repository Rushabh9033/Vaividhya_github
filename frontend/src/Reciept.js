import { useState } from "react";
import API from "../api";

function Receipt() {
  const [enroll, setEnroll] = useState("");
  const [data, setData] = useState(null);

  const findReceipt = async () => {
    const res = await API.get(`/receipt/${enroll}`);
    setData(res.data);
  };

  return (
    <div>
      <input onChange={e => setEnroll(e.target.value)} />
      <button onClick={findReceipt}>Find Receipt</button>

      {data && (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}
export default Receipt;