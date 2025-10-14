import React, { useEffect } from "react";

const useFetch = <T>(fetchFunction: () => Promise<T>, autofetch = true) => {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchFunction();
console.log(result)
      setData(result);

    } catch (err) {
      // @ts-ignore
      setError(err instanceof Error ? err : new Error("An error occurred"));
    } finally {
      setLoading(false);
    }
  };
  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  useEffect(() => {
    if (autofetch) {
      fetchData();
    }
  }, []);

  return { data, loading, error, fetchData, reset };
};

export default useFetch