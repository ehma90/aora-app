import { useEffect, useState } from "react";
import { Alert } from "react-native";

const useAppWrite = (fn: any) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await fn();

      setData(response);
    } catch (error) {
      Alert.alert("Error", "Posts did not fetch properly");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => fetchData();

  return { data, isLoading, refetch };
};

export default useAppWrite;
