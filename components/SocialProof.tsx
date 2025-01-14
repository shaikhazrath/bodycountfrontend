import Image from 'next/image'

const testimonials = [
  { name: "Sarah L.", quote: "NutriSnap has revolutionized how I track my meals. It's so easy and accurate!" },
  { name: "Mike R.", quote: "As a fitness enthusiast, this app is a game-changer. Highly recommended!" },
  { name: "Emily T.", quote: "I love how quickly I can get nutritional info. It's perfect for my busy lifestyle." }
]

export default function SocialProof() {
  return (
    <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-primary-foreground">What Our Users Say</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 bg-secondary rounded-lg shadow">
              <p className="text-muted-foreground mb-4">"{testimonial.quote}"</p>
              <p className="font-bold text-primary-foreground">{testimonial.name}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <p className="text-2xl font-bold mb-4 text-primary-foreground">Trusted by over 1 million users worldwide</p>
          <div className="flex justify-center gap-8 mt-8">
            {[1, 2, 3, 4].map((i) => (
              <Image key={i} src={`/placeholder.svg`} alt={`Partner logo ${i}`} width={100} height={50} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

