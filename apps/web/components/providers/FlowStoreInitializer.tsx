"use client"
import {useRef} from 'react';
import {useFlowStore} from '@/store/slices/flow/flowStore';
import type {FlowBoardOverview, FlowBoardResponse, FullFlowCourseResponse} from '@studo/types';

interface Props {
    boards?: FlowBoardOverview[];
    board?: FlowBoardResponse;
    course?: FullFlowCourseResponse;
}

export default function FlowStoreInitializer({boards, board, course}: Props) {
    const prevIds = useRef<string>('');

    // Build a key from the data IDs so we re-hydrate when navigating to different entities
    const key = [
        boards ? 'b' : '',
        board?.id ?? '',
        course?.id ?? '',
    ].join(':');

    if (prevIds.current !== key) {
        const store = useFlowStore.getState();
        if (boards) store.setBoards(boards);
        if (board) store.setActiveBoard(board);
        if (course) store.setActiveCourse(course);
        prevIds.current = key;
    }

    return null;
}
