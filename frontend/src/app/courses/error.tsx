"use client";


const error=({error,reset}:{error:Error,reset:()=>void})=>{
 return (
    <div className="container py-5 text-center">
      <h2 className="mb-3">Something went wrong!</h2>
      <img src="https://template.canva.com/EAEnLiB3c9s/2/0/1600w-yYoQLsvan80.jpg"></img>
      <p className="text-muted">{error.message}</p>
      <button onClick={() => reset()} className="btn btn-primary mt-3 "data-bs-toggle="tooltip">
        Try again
      </button>
    </div>
  );
}


export default error