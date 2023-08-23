import { createRoutesFromElements, Route, Routes } from 'react-router-dom'
import Home from './components/Home.tsx'
import Login from './components/Login.tsx'
import Layout from './components/Layout.tsx'

const routes = createRoutesFromElements(
  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="/login" element={<Login />} />
  </Route>,
)

export default routes
