import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Dashboard from "./Dashboard";
import ActivationRequest from "./ActivationRequest";

export default function Home() {
  const { user } = useAuth();
  
  // Handle database typo: CUSTMER should be CUSTOMER
  const normalizedRole = user?.ROLE === 'CUSTMER' ? 'CUSTOMER' : user?.ROLE;
  
  if (normalizedRole === 'ADMIN') {
    return <Dashboard />;
  }
  
  if (normalizedRole === 'CUSTOMER') {
    return <ActivationRequest />;
  }
  
  return null;
}
