// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get("token" )?.value;

//   // Redireciona se não houver token
//   if (!token) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   try {
//     const payload = JSON.parse(
//       Buffer.from(token.split(".")[1], "base64").toString()
//     );

//     const tipoUsuario = payload.tipo_usuario;

//     // Verificar o caminho da URL
//     const path = request.nextUrl.pathname;

    
//     if (path.startsWith("/perfilcomprador") && tipoUsuario !== "Comprador") {
//       return NextResponse.redirect(new URL("/", request.url));
//     }

//     if (path.startsWith("/perfilagricultor") && tipoUsuario !== "Agricultor") {
//       return NextResponse.redirect(new URL("/", request.url));
//     }

//     if (path.startsWith("/perfilfornecedor") && tipoUsuario !== "Fornecedor") {
//       return NextResponse.redirect(new URL("/", request.url));
//     // }

//     return NextResponse.next(); // Tudo certo, segue o fluxo
//   } catch (error) {
//     console.error("Erro no middleware:", error);
//     return NextResponse.redirect(new URL("/login", request.url));
//   }
// }
