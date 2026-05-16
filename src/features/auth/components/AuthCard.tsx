import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export const AuthCard = ({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) => {
  return (
    <Card className="w-full h-full sm:h-fit sm:max-w-110 p-5 pt-16 sm:p-9.25 flex flex-col ">
      <CardHeader className="text-center p-0!">
        <CardTitle className="flex flex-col gap-3">
          {/* title */}
          <header className="w-full">
            <h1 className="text-xl sm:text-[26px] font-inter font-bold text-foreground">
              {title}
            </h1>
            <p className="font-normal">{description}</p>
          </header>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0!">
        {children}
      </CardContent>
    </Card>
  )
}