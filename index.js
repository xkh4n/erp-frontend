import LoginForm from './src/components/LoginForm/LoginForm';
import connectDB from './services/mongoService';
connectDB();
function App() {
  return (
    <div>
      <h1>Formulario de Login</h1>
      <LoginForm />
    </div>
  );
}