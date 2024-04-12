import styled from "styled-components";
import Link from "next/link";
import { ButtonStyle } from "./Button";

const StyledLink = styled(Link)`
    ${ButtonStyle}
`;

export default function ButtonLink(props)
{
  return (
   <StyledLink {...props}/>
  
  )
}

