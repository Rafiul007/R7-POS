import { useMutation } from '@tanstack/react-query';
import {
  closeShift,
  type CloseShiftPayload,
  type ShiftResponse,
} from '../../api/shift/shiftApi';
import { useAuth } from '../../auth';

interface UseCloseShiftPayload {
  shiftId: string;
  payload: CloseShiftPayload;
}

export const useCloseShift = () => {
  const { accessToken } = useAuth();

  return useMutation<ShiftResponse, Error, UseCloseShiftPayload>({
    mutationFn: ({ shiftId, payload }) =>
      closeShift(shiftId, payload, { accessToken }),
  });
};
