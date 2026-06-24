import { Route, Routes } from "react-router-dom";
import { NotAuthorized } from "./components/NotAuthorized";
import { routePaths } from "./config/routes";
import { LoginPage } from "./features/auth/LoginPage";
import { RegisterPage } from "./features/auth/RegisterPage";
import { InquiriesPage } from "./features/inquiries/InquiriesPage";
import { ListingDetailsPage } from "./features/listings/ListingDetailsPage";
import { ListingSearchPage } from "./features/listings/ListingSearchPage";
import { ProfilePage } from "./features/profile/ProfilePage";
import { AppLayout } from "./layouts/AppLayout";
import { ProtectedRoute } from "./layouts/ProtectedRoute";

export const App = () => (
  <Routes>
    <Route element={<AppLayout />}>
      <Route path={routePaths.home} element={<ListingSearchPage />} />
      <Route path={routePaths.listingDetails} element={<ListingDetailsPage />} />
      <Route path={routePaths.login} element={<LoginPage />} />
      <Route path={routePaths.register} element={<RegisterPage />} />
      <Route
        path={routePaths.profile}
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path={routePaths.inquiries}
        element={
          <ProtectedRoute>
            <InquiriesPage />
          </ProtectedRoute>
        }
      />
      <Route path={routePaths.notAuthorized} element={<NotAuthorized />} />
      <Route path="*" element={<ListingSearchPage />} />
    </Route>
  </Routes>
);
