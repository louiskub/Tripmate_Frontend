"use client"

import { memo } from "react"
import type { ServiceItem } from "../trip.types"
import { ICONS } from "../icons"

function ServiceRow({ service }: { service: ServiceItem }) {
  const Icon = service.iconKey ? ICONS[service.iconKey] : undefined
  return (
    <div className="w-full px-3 py-2 bg-blue-50/60 rounded-lg flex items-start gap-3">
      {Icon ? <Icon className="w-5 h-5 text-blue-800 mt-0.5 shrink-0" /> : null}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-black">{service.name}</div>
            {service.details && <div className="text-sm text-gray-600 mt-0.5">{service.details}</div>}
            <div className="flex items-center gap-2 mt-1">
              {service.price && <span className="text-sm font-medium text-blue-800">{service.price}</span>}
              {service.quantity && (
                <span className="text-xs px-2 py-0.5 bg-white rounded-full text-gray-600">x{service.quantity}</span>
              )}
            </div>
          </div>
          {service.serviceLabel && (
            <span className="px-2 py-1 rounded-lg bg-white text-xs font-medium text-blue-800 shrink-0">
              {service.serviceLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default memo(ServiceRow)
