import { DividerVerticalIcon } from "@radix-ui/react-icons"

export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-6 py-8">
                {/* Top section - Country and Language */}
                <div className="mb-6">
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <a href="https://www.hoergen.com" className="text-muted-foreground hover:text-foreground transition-colors">
                            Home
                        </a>                        <DividerVerticalIcon className="h-4 w-4" />
                        <span className="select-none">English</span>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                    Copyright © 2025 Hörgen Radio. All rights reserved.
                </p>
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    <a href="https://www.hoergen.com/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                        Terms of Service
                    </a>
                    <a href="https://www.hoergen.com/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                        Privacy Policy
                    </a>
                    <a href="https://www.hoergen.com/feedback" className="text-muted-foreground hover:text-foreground transition-colors">
                        Feedback
                    </a>
                </div>
            </div>
        </footer>
    )
}
