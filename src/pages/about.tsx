import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const AboutPage = () => {
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="max-w-3xl mx-auto">
          {/* Profile Section */}
          <section className="mb-12 text-center">
            <Avatar className="w-32 h-32 mx-auto mb-6">
              <AvatarImage src="/avatar.png" alt="Profile" />
              <AvatarFallback>DY</AvatarFallback>
            </Avatar>
            <h1 className="text-4xl font-bold mb-4">Dahyeong Yun</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Software Developer
            </p>
          </section>

          {/* About Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert">
              <p>
                안녕하세요, 소프트웨어 개발자 윤다형입니다. 웹 개발과 기술 공유에 관심이 많으며,
                현재는 주로 백엔드 개발을 하고 있습니다.
              </p>
            </CardContent>
          </Card>

          {/* Skills Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {["Java", "Spring", "Sql", "Javascript"].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Contact & Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  더 자세한 내용이 궁금하시다면 아래 링크들을 통해 연락해주세요.
                </p>
                <div className="flex gap-4">
                  <Button asChild variant="outline">
                    <Link to="/blog">
                      Blog Posts
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/note">
                      Notes
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Experience Section */}
          <Card>
            <CardHeader>
              <CardTitle>Work Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">Software Developer</h3>
                  <p className="text-muted-foreground">Company Name • 2020 - Present</p>
                  <p className="mt-2">
                    주요 업무 및 성과 내용을 이곳에 작성하시면 됩니다.
                  </p>
                </div>
                {/* Add more experiences as needed */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

export default AboutPage

// Head export for SEO
export const Head = () => <title>About - Polymorlog</title>
