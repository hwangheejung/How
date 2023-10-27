import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

function Routineapi() {
  const [routines, setRoutine] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchroutine = async () => {
    try {
      setRoutine(null);
      setLoading(true);
      setError(null);

      const response = await axios.get("http://52.78.0.53/api/ex-routine/all");
      setRoutine(response.data);
    } catch (e) {
      setError(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchroutine();
  }, []);

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러발생!!</div>;
  if (!routines) return <div>null</div>;

  return (
    <>
      <ul>
        {routines.result.routines.map((routine) => (
          <li key={routine.id}>
            {routine.id}, {routine.hits}
          </li>
        ))}
      </ul>
      <button onClick={fetchroutine}>다시 불러오기</button>
    </>
  );
}

export default Routineapi;
