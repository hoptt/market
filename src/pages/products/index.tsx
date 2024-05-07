export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: "/products/manage",
      permanent: false,
    },
  };
};

export default function Products() {
  return null;
}
