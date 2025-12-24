import { useState, useEffect } from 'react';
import api from '../../service/api';

function useFetch(url) {
  const [data,    setData]      = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState(null );

  useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(url);
                setData(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

  return { data, loading, error, setData  };
}

export default useFetch;