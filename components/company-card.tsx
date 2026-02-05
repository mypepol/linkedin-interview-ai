import Link from "next/link"
import { Briefcase, Users, Globe, Building2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

import { CompanyData } from "@/types"

export function CompanyCard({ company }: { company: CompanyData }) {
    return (
        <Card className="h-full border-t-4 border-t-primary shadow-lg">
            <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-3xl font-bold text-primary">
                            {company.name}
                        </CardTitle>
                        <div className="flex items-center text-muted-foreground">
                            <Building2 className="mr-2 h-4 w-4" />
                            {company.industry}
                        </div>
                    </div>
                    {company.logoUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={company.logoUrl}
                            alt={`${company.name} logo`}
                            className="h-16 w-16 rounded object-contain"
                        />
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{company.employeeCount} Çalışan</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <Link
                            href={company.website}
                            target="_blank"
                            className="text-blue-600 hover:underline truncate"
                        >
                            Web Sitesi
                        </Link>
                    </div>
                </div>

                <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Hakkında</h4>
                    <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
                        {company.description}
                    </p>
                </div>

                {company.specialties && company.specialties.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="font-semibold text-foreground">Uzmanlık Alanları</h4>
                        <div className="flex flex-wrap gap-2">
                            {company.specialties.slice(0, 8).map((specialty, i) => (
                                <span
                                    key={i}
                                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                >
                                    {specialty}
                                </span>
                            ))}
                            {company.specialties.length > 8 && (
                                <span className="text-xs text-muted-foreground flex items-center">
                                    +{company.specialties.length - 8} diğer
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
