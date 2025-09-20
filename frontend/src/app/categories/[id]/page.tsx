import React from 'react';

type PageProps = {
  params: { id: number };
};

async function Page({ params }: PageProps) {
  const id = params.id;
  console.log(id)

  return (<>
   <section
        className="d-flex align-items-center "
        style={{
          height: "80vh",
          background:
            "url(https://i.postimg.cc/T3Hxgjj6/2f33b722-c583-4b2e-a5d1-254a74412461.png) no-repeat center center / cover",
        }}
      >
       </section>
    <div>Page id: {id}</div></>
  );
}

export default Page;