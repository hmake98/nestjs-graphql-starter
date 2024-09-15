import { Controller, Get } from '@nestjs/common';
import {
    DiskHealthIndicator,
    HealthCheck,
    HealthCheckService,
    MemoryHealthIndicator,
} from '@nestjs/terminus';
import { Public } from 'src/core/decorators/public.decorator';
import { PrismaService } from 'src/database/services/prisma.service';

@Controller('health')
export class AppController {
    constructor(
        private health: HealthCheckService,
        private prismaService: PrismaService,
        private memory: MemoryHealthIndicator,
        private disk: DiskHealthIndicator
    ) {}

    @Get()
    @Public()
    @HealthCheck()
    check() {
        return this.health.check([
            () => this.prismaService.isHealthy(),
            () => this.memory.checkHeap('memory_heap', 1000 * 1024 * 1024),
            () => this.memory.checkRSS('memory_RSS', 1000 * 1024 * 1024),
            () =>
                this.disk.checkStorage('disk_health', {
                    thresholdPercent: 10,
                    path: '/',
                }),
        ]);
    }
}
