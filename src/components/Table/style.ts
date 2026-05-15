import styled from "styled-components";
export const Table = styled.table`
  margin: 0;
  padding: 0;
  border: 1px solid #ccc;
  border-collapse: collapse;
  width: 100%;
  table-layout: fixed;

  @media screen and (max-width: 600px){
    border: none;
    font-size: 1.3em;
  }

  @media screen and (max-width: 600px){
    thead{
      border: none;
      clip: rect(0 0 0 0);
      height: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      width: 1px;
    }


    tr{
      border-bottom: 1px solid #ddd;
      display: block;
      margin-bottom: .65em;
      background-color: #333;
      color: #000;
    }

    td{
      border-bottom: 1px solid #ddd;
      display: block;
      font-size: .8em;
      text-align: right;
    }

    td:before{
      content: attr(data-label);
      float: left;
      font-weight: 600;
      text-transform: uppercase;
    }

    td:last-child{
      border-bottom: 0;
    }
  }

  table caption{
    font-size: 1.2rem;
    margin: .5em 0 .75em ;
  }

  tr{
    background-color: #f8f8f8;
    border: 1px solid #ddd;
    padding: .35em;
  }

  th,td{
    padding: .62em;
    text-align: center;
  }

  th{
    text-transform: uppercase;
    background-color: #333;
    color: #f8f8f8;
  }

  td .badge{
    padding: 6px;
    border-radius: 4px;
    color: #f8f8f8;
    font-weight: 600;
  }

  td .action{
    border: 0;
    margin-right: 8px;
    padding: 6px;
    border-radius: 4px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  td .action svg {
    vertical-align: middle;
  }
`