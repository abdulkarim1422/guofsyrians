import { Helmet } from "react-helmet-async";

export const SEO = ({ name, ocupation, description }) => {
  return (
    <Helmet>
      <title>{name} - {ocupation}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
};
