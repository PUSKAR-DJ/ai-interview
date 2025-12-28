export function useInterview(id) {
  const [interview, setInterview] = useState(null);

  useEffect(() => {
    getInterview(id).then((res) => setInterview(res.data));
  }, [id]);

  return interview;
}
