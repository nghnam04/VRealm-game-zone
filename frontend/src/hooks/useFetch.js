import { useState, useEffect, useCallback } from "react";

const useFetch = (asyncFunction, dependencies = [], lazy = false) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!lazy);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (params) => {
      setLoading(true);
      setError(null);
      try {
        const result = await asyncFunction(params);
        setData(result.data);
        return { data: result.data };
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction]
  );

  useEffect(() => {
    if (!lazy) {
      execute();
    }
  }, [...dependencies, lazy]);

  return { data, loading, error, execute };
};

export default useFetch;
