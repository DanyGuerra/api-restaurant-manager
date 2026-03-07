import { IsBoolean, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { TicketFontSize, TicketPaperSize } from 'entities/ticket-setting.entity';

export class UpdateTicketSettingDto {
    @IsOptional()
    @IsNumber()
    @IsIn([58, 80, 112])
    paper_size?: TicketPaperSize;

    @IsOptional()
    @IsNumber()
    @IsIn([0.3, 0.5, 0.7, 1.0, 1.5, 2.0])
    font_size?: TicketFontSize;

    @IsOptional()
    @IsBoolean()
    show_notes?: boolean;

    @IsOptional()
    @IsBoolean()
    show_customer_info?: boolean;

    @IsOptional()
    @IsBoolean()
    show_business_address?: boolean;

    @IsOptional()
    @IsBoolean()
    show_thank_you_message?: boolean;

    @IsOptional()
    @IsString()
    thank_you_message?: string;

    @IsOptional()
    @IsString()
    thank_you_message_en?: string;

    @IsOptional()
    @IsBoolean()
    show_info_message?: boolean;

    @IsOptional()
    @IsString()
    info_message?: string;

    @IsOptional()
    @IsString()
    info_message_en?: string;

    @IsOptional()
    @IsBoolean()
    show_phone?: boolean;

    @IsOptional()
    @IsBoolean()
    show_cashier?: boolean;
}
