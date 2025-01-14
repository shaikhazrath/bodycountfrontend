import Image from 'next/image'

const steps = [
  { title: "Take a Photo", description: "Snap a picture of your meal using our mobile app." },
  { title: "Upload", description: "The photo is instantly uploaded to our AI-powered system." },
  { title: "Analysis", description: "Our AI analyzes the image and identifies food items." },
  { title: "Results", description: "Receive comprehensive nutritional information within seconds." }
]

export default function UserFlow() {
  return (
    <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-primary-foreground">How It Works</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                {index + 1}
              </div>
              <h3 className="text-xl font-bold mb-2 text-primary-foreground">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 flex justify-center">
          <Image
            src="/placeholder.svg"
            alt="Mobile app screenshots"
            width={800}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  )
}

