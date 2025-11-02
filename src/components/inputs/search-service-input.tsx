"use client"

import React, { FC, ReactNode, ChangeEvent, useState,useEffect, Children, useRef } from "react";
import { ButtonText, Body, SubBody } from '@/components/text-styles/textStyles'
import DropdownIcon from '@/assets/icons/pagination-arrow.svg'
import { FieldInput } from "./inputs";
import SearchIcon from '@/assets/icons/search.svg'
import LocationIcon from '@/assets/icons/tourist-attracton.svg'
import CalendarIcon from '@/assets/icons/booking.svg'
import PersonIcon from '@/assets/icons/person.svg'
import PlusIcon from '@/assets/icons/plus.svg'
import MinusIcon from '@/assets/icons/minus.svg'
import { Button } from "../buttons/buttons";

import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Tag } from "../services/other/Tag";
import useClickOutside from "@/utils/service/close-click-outside";

type SearchServiceInputProps = {
    
};

export const SearchServiceInput: FC<SearchServiceInputProps> = () => {
    const [location, setLocation] = useState('')
    const today = new Date();

    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(today.getDate() + 2);


    const options: Intl.DateTimeFormatOptions = {
        weekday: "short",  // Tue
        day: "numeric",    // 2
        month: "short"     // Nov
    };

    // State for the range
    const [checkIn, setCheckIn] = useState<Date | undefined>(tomorrow);
    const [checkOut, setCheckOut] = useState<Date | undefined>(dayAfterTomorrow);
    const [rooms, setRooms] = useState(1)
    const [guests, setGuests] = useState(2)

    const [openDate, setOpenDate] = useState(false);
    const [openRoomInfo, setOpenRoomInfo] = useState(false);

    const [focused, setFocused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const dateRef = useRef<HTMLDivElement>(null);
    const roomRef = useRef<HTMLDivElement>(null);

    useClickOutside(dateRef, () => setOpenDate(false))
    useClickOutside(roomRef, () => setOpenDate(false))

    const nights = checkIn && checkOut 
    ? Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

    const toggleDate = () => {
    setOpenDate(prev => !prev);       // toggle date panel
    setOpenRoomInfo(false);           // close room info
    };

    const toggleRoomInfo = () => {
    setOpenRoomInfo(prev => !prev);   // toggle room info panel
    setOpenDate(false);               // close date panel
    };
    
    return (
    <div className={`flex rounded-xl p-2.5 shadow-[var(--light-shadow)] bg-custom-white items-center gap-2.5`}>
        <div ref={containerRef} className={`relative hover:bg-dark-white flex items-center gap-2 px-2 text-custom-black bg-custom-white rounded-[10px] h-12 basis-1/3 border border-light-gray`}>
            <LocationIcon width='20' height='20' className='text-dark-blue' />
            <input 
                onFocus={() => setFocused(true)}
                className="h-full w-full focus:outline-0 appearance-none bg-transparent"
                placeholder='Where to ?'
                value={location}
                onChange={(e) => setLocation(e.target.value)} />
                {focused && <LocationPopup 
                    onChange={setLocation}
                    close={() => setFocused(false)}
                />}
        </div>
        <div className="hover:bg-dark-white flex items-center relative hover:cursor-pointer gap-2 px-2 text-custom-black bg-custom-white rounded-[10px] h-12 basis-1/3 border border-light-gray">
            <div
                ref={dateRef}
                onClick={toggleDate} 
                className={`flex items-center w-full`}>
                <CalendarIcon width='20' height='20' className='text-dark-blue'/>
                <div className="flex items-center justify-evenly flex-1 select-none">
                    <Body>
                        {checkIn ? 
                        checkIn.toLocaleDateString("en-US", options)
                        :
                        "Select Date"}
                    </Body>
                    <Body>
                        →
                    </Body>
                    <Body>
                        {checkOut ? 
                        checkOut.toLocaleDateString("en-US", options)
                        :
                        "Select Date"}
                    </Body>
                    <Tag>{nights > 0 ? `${nights} night${nights > 1 ? 's' : ''}` : ''}</Tag>
                </div>
            </div>
            { openDate && (
                <CalendarPopup
                    checkIn={checkIn}
                    checkOut={checkOut}
                    setCheckIn={setCheckIn}
                    setCheckOut={setCheckOut}
                    onClose={() => setOpenDate(false)}
                />)
            }
        </div>
        <div
            className={`relative hover:bg-dark-white flex items-center gap-2 px-2 text-custom-black bg-custom-white rounded-[10px] h-12 basis-1/4 border border-light-gray hover:cursor-pointer`}>
            <div
                ref={roomRef}
                onClick={toggleRoomInfo}
                className="flex items-center w-full gap-3">
                <PersonIcon width='20' height='20' className='text-dark-blue'/>
                <Body className="select-none">
                    {rooms} {rooms === 1 ? 'room' : 'rooms'}, {guests} {guests === 1 ? 'guest' : 'guests'}
                </Body>
            </div>
            { openRoomInfo && (
                <RoomInfoPopup
                    guest={guests}
                    onChangeGuest={setGuests}
                    room={rooms}
                    onChangeRoom={setRooms}
                    onClose={() => setOpenRoomInfo(false)}
                />
                )
            }
        </div>
        <Button text='search' className="bg-dark-blue text-white px-2! h-12">
            <SearchIcon width='20' height='20'/>
        </Button>
    </div>
)};

type LocationPopupProps = {
    onChange: (location: string) => void
    close: () => void
}

const LocationPopup = ({onChange, close}: LocationPopupProps) => {
    const locations: string[] = ['Pattaya', 'Bangsaen', 'Bangkok', 'Samui', 'Chiangmai', 'Bla', 'Bla', 'Bla']
    return (
    <div className="absolute grid auto-rows-min gap-x-8 gap-y-3 rounded-2xl bg-custom-white z-20 left-0 top-14.5 shadow-[var(--boxshadow-lifted)] py-3 px-5">
            <SubBody className="col-span-4 font-bold!">Popular locations</SubBody>
            {locations.map((location, idx) => (
                <button
                    className="default-btn text-left hover:cursor-pointer"
                    onClick={() => {
                        onChange(location)
                        close()
                    }}
                    key={idx}>
                        {location}
                </button>
            ))}
        </div>
    )
}

type RoomInfoPopupProps = {
    guest: number
    onChangeGuest: (guest_num: number) => void;
    room: number
    onChangeRoom: (room_num: number) => void;
    onClose: () => void
}

const RoomInfoPopup = ({guest, onChangeGuest, room, onChangeRoom, onClose}: RoomInfoPopupProps) => {
    return (
        <div className="absolute flex flex-col gap-4 rounded-2xl bg-custom-white w-full z-20 top-14.5 shadow-[var(--boxshadow-lifted)] p-4 select-none">
            <div className="flex justify-between items-center">
                <Body>Guest</Body>
                <div className="flex items-center gap-2">
                    <button
                    className={`bg-dark-blue text-custom-white rounded-full p-1 ${guest < 1 ? 'opacity-50 pointer-events-none' : ''}`}
                    onClick={() => onChangeGuest(guest - 1)}
                    >
                    <MinusIcon width="14" />
                    </button>

                    <span className="px-2 w-8 text-center">{guest}</span>

                    <button
                    className={`bg-dark-blue text-custom-white rounded-full p-1 ${guest >= 10 ? 'opacity-50 pointer-events-none' : ''}`}
                    onClick={() => onChangeGuest(guest + 1)}
                    >
                    <PlusIcon width="14" />
                    </button>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <Body>Room</Body>
                <div className="flex items-center gap-2">
                    <button
                    className={`bg-dark-blue text-custom-white rounded-full p-1 ${room < 1 ? 'opacity-50 pointer-events-none' : ''}`}
                    onClick={() => onChangeRoom(room - 1)}
                    >
                    <MinusIcon width="14" />
                    </button>

                    <span className="px-2 w-8 text-center">{room}</span>

                    <button
                    className={`bg-dark-blue text-custom-white rounded-full p-1 ${room >= 10 ? 'opacity-50 pointer-events-none' : ''}`}
                    onClick={() => onChangeRoom(room + 1)}
                    >
                    <PlusIcon width="14" />
                    </button>
                </div>
            </div>
            <Button
                onClick={onClose}
                className="bg-dark-blue text-white h-8!" text="Done" />
        </div>
    )
}

type CalendarPopupProps = {
    checkIn: Date | undefined
    checkOut: Date | undefined
    setCheckIn: (d: Date | undefined) => void;
    setCheckOut: (d: Date | undefined) => void;
    onClose: () => void
}

const CalendarPopup = ({ checkIn, checkOut, setCheckIn, setCheckOut, onClose }: CalendarPopupProps) => {
    const today = new Date();
    const selectionRange = {
        startDate: checkIn,
        endDate: checkOut,
        key: "selection",
    };

    const handleSelect = (ranges: any) => {
        setCheckIn(ranges.selection.startDate);
        setCheckOut(ranges.selection.endDate);
    };

    return (
        <div
        className="absolute z-20 bg-white rounded-xl p-3 top-14.5 left-0 shadow-[var(--boxshadow-lifted)]"
        onClick={(e) => e.stopPropagation()}
        >
        <DateRangePicker
            ranges={[selectionRange]}
            onChange={handleSelect}
            moveRangeOnFirstSelection={false}
            rangeColors={['var(--color-dark-blue)']}
            months={2}
            direction="horizontal"
            date={checkIn || new Date()}
            minDate={today}
            showPreview={true}
            weekdayDisplayFormat="EEE"
            fixedHeight={true}
            showDateDisplay={false}
            staticRanges={[]} 
            inputRanges={[]}   
        />
        <button
            className="w-full mt-2 bg-dark-blue text-white py-2 rounded-lg"
            onClick={onClose}
        >
            Done
        </button>
        </div>
    );
};


export default SearchServiceInput