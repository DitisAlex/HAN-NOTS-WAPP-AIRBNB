import React from "react";

import Test from "./Test";
import Navbars from "./Navbar";
import Home from "./Home";

export default function App() {
  const [updateMap, setUpdateMap] = React.useState(1);

  return (
    <div>
      <Navbars />
      <Home updateMap={updateMap} setUpdateMap={setUpdateMap}/>
    </div>
  );
}
