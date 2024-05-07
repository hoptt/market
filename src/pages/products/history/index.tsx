export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: "/products/history/sell",
      permanent: false,
    },
  };
};

export default function ProductsHistory() {
  return null;
}
