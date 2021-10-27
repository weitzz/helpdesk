import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`

*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  outline: none;
}

body{
  font-size: 16px;
  font-family: sans-serif;
}

li{
  list-style: none;
}
a{
  text-decoration: none;
}
`;

export default GlobalStyle