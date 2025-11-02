import BasePage from './BasePage';
import ProductList from '../components/ProductList';
import './HomePage.css';
import { getProducts } from '../api/reviews';
import { useSearchParams } from 'react-router-dom';

function ProductsPage() {
  const [searchParams] = useSearchParams();
  const establishmentId = searchParams.get('establishment_id');
  const fetcher = establishmentId ? () => getProducts(establishmentId) : undefined;
  return (
    <BasePage>
      <ProductList fetchProducts={fetcher} />
    </BasePage>
  );
}

export default ProductsPage;
