
export const Data = ({ data }) => {
  if (!data || !data.analysis) {
    return (<div className="bg-gray-50 rounded-sm p-4 mt-6"><p className="text-gray-500">No Data available.</p></div>)

  }

  return (
    <div className="bg-gray-100 p-4 rounded-md mt-6">
      <h2 className="text-lg font-semibold mb-2">Data</h2>
      <pre className="text-sm bg-white p-3 rounded-md border border-gray-300 overflow-x-auto">
        {JSON.stringify(data.analysis, null, 2)}
      </pre>
    </div>
  );
};
