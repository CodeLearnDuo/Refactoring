import * as React from "react";
import {createBrowserRouter, RouterProvider, useLocation} from "react-router-dom";
import MainTable from "./MainTable";
import {ThemeProvider} from "next-themes";
import {Spacer} from "@nextui-org/react";
import NavBar from "./Navbar";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import HeroPage from "./HeroPage";
import HeroCreater from "./HeroCreater";
import CommentPage from "./CommentPage";

const router = createBrowserRouter([
    {
        path: "/main",
        element: <TransformerPage />,
    },
    {
        path: "/loginpage",
        element: <LoginPage/>
    },
    {
        path: "/signuppage",
        element: <RegisterPage/>
    },
    {
        path: "/hero",
        element: <HeroPage/>
    },
    {
        path: "/createhero",
        element: <HeroCreater/>
    },
    {
        path: "/comments",
        element: <CommentPage/>
    }
]);

function App() {
  return (
      <ThemeProvider attribute="class">
          <RouterProvider router={router} />
      </ThemeProvider>
  );
}

function TransformerPage() {
  let {user} = useLocation().state || {};

    return (
        <div>
            <NavBar user={user}/>
            <div style={{display: 'flex'}}>
                <Spacer x={5}/>
                <Spacer y={5}/>
                <MainTable user={user}/>
                <Spacer x={5}/>
            </div>
        </div>
    )
}

export default App;
