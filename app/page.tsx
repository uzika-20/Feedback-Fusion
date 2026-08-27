import GradientHeader from "@/components/gradient-header";
import NewFeedbackButton from "@/components/new-feedback-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart, Map, MessageSquare, Users, Zap } from "lucide-react";
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* HERO SECTION */}
      <GradientHeader title="Shape the future of our product" subTitle="Feedback fusion is where your ideas come to life .Suggest features,vote on what matters most, and follow our public roadmap ">
        <div className="flex flex-col gap-3 justify-center pt-4 w-full">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 w-full">
            <NewFeedbackButton
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto"
              label="Submit Feedback"
              icon="arrow"
            />
            <Button size="lg" className="bg-white text-black hover:bg-gray-100 w-full sm:w-auto">
              <Link href="/roadmap" className="flex items-center justify-center gap-2">
                View Roadmap
                <Map className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </GradientHeader>
      {/* Feature section */}
      <section>
        <h2 className="text-center mb-8 text-3xl font-bold">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Submit Ideas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Share your suggestions and features requests with the community.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <BarChart className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Vote & prioritize</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Upvote ideas you love to help us understand what matters most. </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Track Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Follow our public roadmap to see what we&#39;re working on next.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mb-2" />
              <CardTitle>See Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Watch your feedback transforms into real features and improvements.</p>
            </CardContent>
          </Card>
        </div>
      </section>
      {/* stats */}
      <section className="text-center px-4 sm:px-0">
        <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-md sm:max-w-none mx-auto">
          <div>
            <div className="text-2xl sm:text-3xl font-bold">1,234+</div>
            <div className="text-xs sm:text-base text-muted-foreground">Suggestions</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold">1,234+</div>
            <div className="text-xs sm:text-base text-muted-foreground">Suggestions</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold">254+</div>
            <div className="text-xs sm:text-base text-muted-foreground">Features Shipped</div>
          </div>
        </div>
      </section>
    </div>
  )
}