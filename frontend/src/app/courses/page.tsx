"use client";
import 'animate.css'
import { useEffect, useState } from "react";

interface Category{
  name:string,
  id:number,
description?:string,
image?:string
}




  const coursesPage=() =>{
 const [categories, setCategories] = useState<Category[]>([
   { id: 1, name: "Web Development", description: "HTML, CSS, React", image:"https://template.canva.com/EAFnEX6N8wM/2/0/1600w-ZSqzhS1dEGo.jpg" },
 
   { id: 4, name: "Business", description: "Marketing, Management", image: "https://cdn.elearningindustry.com/wp-content/uploads/2021/12/shutterstock_788679025.jpg" },
  { id: 2, name: "Data Science", description: "Python, ML, AI", image: "https://template.canva.com/EAGKUSePKmo/1/0/1600w-Rg1161onGgw.jpg" },
  { id: 3, name: "Business", description: "Marketing, Management", image: "https://tecnosoluciones.com/wp-content/uploads/2019/04/Fundamentos-del-Elearning.jpg" },
  { id: 4, name: "Business", description: "Marketing, Management", image: "https://cdn.elearningindustry.com/wp-content/uploads/2021/12/shutterstock_788679025.jpg" },
{ id: 5, name: "Business", description: "Marketing, Management", image: "https://template.canva.com/EAFLD3wihB4/1/0/1600w-ASQOU1sytIE.jpg" },


]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);








  return (
    <div className="container py-5">
      <h2 className="mb-4 fw-bold animate__animated animate__fadeInLeft" style={{"color":"#F6A531","padding":"10px" }}>Course Categories</h2>
      <div className="row g-4">
        {categories.map((cat) => (
          <div key={cat.id} className="col-md-4">
            <div className="card shadow-sm h-100 border-0 rounded-3">
              <img
                src={cat.image || "https://via.placeholder.com/400x200"}
                className="card-img-top"
                alt={cat.name}
              />
              <div className="card-body">
                <h5 className="card-title">{cat.name}</h5>
                <p className="card-text">{cat.description}</p>
                <a href={`/courses/${cat.id}`} className="btn btn-primary" data-bs-toggle="tooltip">
                  View Courses
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}

export default coursesPage