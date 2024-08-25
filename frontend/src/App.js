import 'bootstrap/dist/css/bootstrap.min.css'
import {Nav, Navbar, Container} from "react-bootstrap";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage";
import NewLobby from "./pages/NewLobby";

function App() {
  return (
      <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
          <header>
              <Navbar bg={"dark"} expand="lg" variant="dark">
                  <Container>
                      <Navbar.Brand>BudakBudak</Navbar.Brand>
                      <Navbar.Toggle aria-controls="basic-navbar-nav" />
                      <Navbar.Collapse id="basic-navbar-nav">
                          <Nav className="me-auto w-100 justify-content-end">
                              <a href="/lobby" className="nav-link" target="_blank">New Lobby</a>
                          </Nav>
                      </Navbar.Collapse>
                  </Container>
              </Navbar>
          </header>
          <main>
              <Container className={"mt-3"}>
                  <Routes>
                      <Route path={"/lobby"} element={<NewLobby />} />
                      <Route path={"/"} element={<HomePage />} />
                  </Routes>
              </Container>
          </main>
          <footer className={"mt-auto"}>
              <div className={"text-center"}>Budak Budak</div>
          </footer>
      </div>
      </BrowserRouter>
  );
}

export default App;
