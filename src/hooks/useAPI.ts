import { useState, useCallback } from 'react';
import axios, { Method } from 'axios';

export const useAPI = <Req, Res>() => {
  const [response, setResponse] = useState<{
    message: string;
    data: Res;
    timestamp: Date;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(
    async (path: string, method: Method, data?: Req) => {
      setLoading(true);
      try {
        const res = await axios(path, {
          method,
          headers: { 'Content-Type': 'application/json' },
          data,
        });

        console.log(res.data);
        

        setResponse({
          ...res.data,
          timestamp: new Date(res.data.timestamp),
        });
        setError(null);

        return res.data;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'API Error');
        } else {
          setError((err as Error).message);
        }
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { response, error, loading, fetchData };
};
