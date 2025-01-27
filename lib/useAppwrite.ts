import { useEffect, useState } from "react";
import { Post } from "./appwrite";
import { Alert } from "react-native";

const useAppwrite = (fn: () => Promise<Post[]>) => {
  const [data, setData] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // const data: DataItem[] = [];

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await fn();
      setData(response);
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
      console.log(error);
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

export default useAppwrite;
