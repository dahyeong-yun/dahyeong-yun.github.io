import * as React from "react"
import {
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  MessageCircle,
  Hash,
  LucideIcon  // Lucide 아이콘 타입 추가
} from "lucide-react"
import { SocialLink, SocialPlatform } from "../../config/site-config"
import { Button } from "../ui/button"

// SOCIAL_ICONS의 타입을 LucideIcon으로 수정
const SOCIAL_ICONS: Record<SocialPlatform, LucideIcon> = {
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
  kakaotalk: MessageCircle,
  threads: Hash,
}

interface SocialIconsProps {
  links: SocialLink[]
}

const SocialIcons: React.FC<SocialIconsProps> = ({ links }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {links.map((link) => {
        const Icon = SOCIAL_ICONS[link.platform]
        return (
          <Button
            key={link.platform}
            variant="ghost"
            size="icon"
            asChild
            className="hover:text-primary transition-colors"
          >
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${link.platform}`}
            >
              <Icon className="h-5 w-5" />
            </a>
          </Button>
        )
      })}
    </div>
  )
}

export default SocialIcons
