import BatchForm from "../components/BatchForm";
import BatchList from "../components/BatchList";
import BatchHistory from "../components/BatchHistory";

const Home = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Batch Management</h1>
      <BatchForm />
      <BatchList />
      <BatchHistory />
    </div>
  );
};

export default Home;
